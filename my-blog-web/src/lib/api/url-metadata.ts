import {HttpClient} from './client';
import {API_ENDPOINTS} from './config';

export interface UrlMetadata {
    title: string;
    description: string;
    logo: string;
    domain: string;
    url: string;
    success: boolean;
    error?: string;
}

export interface UrlMetadataResponse {
    code: number;
    message: string;
    data: UrlMetadata | null;
}

class UrlMetadataApiService {
    private readonly httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient();
    }

    /**
     * 获取URL的元数据信息
     */
    async fetchUrlMetadata(url: string): Promise<UrlMetadataResponse> {
        try {
            const response = await this.httpClient.get<UrlMetadata>(API_ENDPOINTS.URL_METADATA.FETCH, {
                url: url
            });
            return {
                code: 200,
                message: '获取成功',
                data: response.data
            };
        } catch (error: any) {
            return {
                code: 500,
                message: error.message || '获取失败',
                data: null
            };
        }
    }
}

export const urlMetadataApiService = new UrlMetadataApiService();
