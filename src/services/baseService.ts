import CONFIG from '@/config/app';

class BaseService {
    private baseUrl: string;
    private token: string | null = null; // Store the token

    constructor() {
        this.baseUrl = CONFIG.baseUrl + '/api'; // Set the base URL from the config
    }

    // Method to set the token
    public setToken(token: string | null) {
        this.token = token;
    }

    // Fetch all resources (GET /path?params)
    public async index<T>(path: string, params: Record<string, any> = {}): Promise<T> {
        const queryString = this.buildQueryString(params);
        const response = await fetch(`${this.baseUrl}${path}${queryString}`, {
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Error fetching resources: ${response.statusText}`);
        }
        return response.json();
    }

    // Fetch a single resource by ID (GET /path/:id?params)
    public async show<T>(path: string, id: string, params: Record<string, any> = {}): Promise<T> {
        const queryString = this.buildQueryString(params);
        const response = await fetch(`${this.baseUrl}${path}/${id}${queryString}`, {
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Error fetching resource: ${response.statusText}`);
        }
        return response.json();
    }

    // Create a new resource (POST /path)
    public async store<T>(path: string, data: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Error creating resource: ${response.statusText}`);
        }
        return response.json();
    }

    // Update an existing resource by ID (PUT /path/:id)
    public async update<T>(path: string, id: string, data: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Error updating resource: ${response.statusText}`);
        }
        return response.json();
    }

    // Delete a resource by ID (DELETE /path/:id)
    public async delete<T>(path: string, id: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Error deleting resource: ${response.statusText}`);
        }
        return response.json();
    }

    // Helper method to get headers
    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Generic POST request (e.g., for login)
    public async post<T>(path: string, data: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Error in POST request: ${response.statusText}`);
        }
        return response.json();
    }


    // Helper method to build query strings
    private buildQueryString(params: Record<string, any>): string {
        const query = new URLSearchParams();
        for (const key in params) {
            if (params[key] !== undefined && params[key] !== null) {
                query.append(key, params[key]);
            }
        }
        return query.toString() ? `?${query.toString()}` : '';
    }
}

const service = new BaseService();
export default service;