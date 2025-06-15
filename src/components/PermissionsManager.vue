<template>
    <div>
        <v-btn color="primary" variant="outlined" class="mt-2" @click="internalDialog = true">
            Manage Permissions
            <v-chip v-if="allowedCount > 0" class="mx-2" color="green" label size="x-small" variant="outlined">
                {{ allowedCount }}
                Allowed
            </v-chip>
            <v-chip v-if="unallowedCount > 0" class="mx-2" color="error" label size="x-small" variant="outlined">
                {{ unallowedCount }}
                Unallowed
            </v-chip>
        </v-btn>

        <v-dialog v-model="internalDialog" max-width="700">
            <v-card>
                <v-card-title class="d-flex justify-space-between align-center">
                    <span>Manage Permissions</span>
                    <v-btn icon @click="internalDialog = false" variant="text">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <div v-if="loading">Loading permissions...</div>
                    <div v-else>
                        <v-expansion-panels multiple>
                            <v-expansion-panel v-for="(perms, group) in groupedPermissions" :key="group">
                                <v-expansion-panel-title>
                                    <div class="d-flex align-center w-100">
                                        <span>{{ groupLabel(group) }}</span>
                                        <div>
                                            <v-chip v-if="groupAllowedCount(group)" class="mx-2" color="green" label
                                                size="x-small" variant="outlined">
                                                {{ groupAllowedCount(group) }}
                                                Allowed
                                            </v-chip>
                                            <v-chip v-if="groupUnallowedCount(group)" class="mx-2" color="error" label
                                                size="x-small" variant="outlined">
                                                {{ groupUnallowedCount(group) }}
                                                Unallowed
                                            </v-chip>
                                        </div>
                                    </div>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <div v-for="perm in perms" :key="perm.key" class="mb-2">
                                        <div class="d-flex justify-space-between align-center w-100">
                                            <span class="mr-4">{{ perm.label }}</span>
                                            <div class="d-flex" style="flex-shrink: 0;">
                                                <v-radio-group :model-value="getPermissionValue(perm.key)"
                                                    @update:model-value="val => setPermissionValue(perm.key, val)"
                                                    inline density="compact" hide-details>
                                                    <v-radio label="Unallow" value="unallow" color="error" />
                                                    <v-radio label="Inherit" value="inherit" />
                                                    <v-radio label="Allow" value="allow" color="green" />
                                                </v-radio-group>
                                            </div>
                                        </div>
                                    </div>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="internalDialog = false">Done</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['update:modelValue']);

const permissions = ref({});
const loading = ref(true);
const localPermissions = ref({ ...props.modelValue });
const internalDialog = ref(false);

watch(
    () => props.modelValue,
    val => (localPermissions.value = { ...val })
);

onMounted(async () => {
    loading.value = true;
    try {
        const response = await service.index(CONFIG.api.appPermissions);
        permissions.value = response || {};
    } finally {
        loading.value = false;
    }
});

const groupedPermissions = computed(() => {
    const groups = {};
    for (const [key, label] of Object.entries(permissions.value)) {
        const [group] = key.split(':');
        if (!groups[group]) groups[group] = [];
        groups[group].push({ key, label });
    }
    return Object.fromEntries(
        Object.entries(groups)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([group, perms]) => [
                group,
                perms.sort((a, b) => a.label.localeCompare(b.label)),
            ])
    );
});

function groupLabel(group) {
    return group.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

function getPermissionValue(key) {
    if (!(key in localPermissions.value)) return 'inherit';
    return localPermissions.value[key] === true ? 'allow' : 'unallow';
}

function setPermissionValue(key, val) {
    const perms = { ...localPermissions.value };
    if (val === 'allow') {
        perms[key] = true;
    } else if (val === 'unallow') {
        perms[key] = false;
    } else if (val === 'inherit') {
        delete perms[key];
    }
    localPermissions.value = perms;
    emit('update:modelValue', { ...localPermissions.value });
}

const allowedCount = computed(() =>
    Object.values(localPermissions.value).filter(v => v === true).length
);
const unallowedCount = computed(() =>
    Object.values(localPermissions.value).filter(v => v === false).length
);

function groupAllowedCount(group) {
    const perms = groupedPermissions.value[group] || [];
    return perms.filter(perm => localPermissions.value[perm.key] === true).length;
}
function groupUnallowedCount(group) {
    const perms = groupedPermissions.value[group] || [];
    return perms.filter(perm => localPermissions.value[perm.key] === false).length;
}
</script>