export interface YoutubeFetchingResponse {
    title: string,
    transcript: string,
    videoId: string,
}

export interface FeatureTypes {
    description: string,
    children: React.ReactNode,
    logo: React.ReactNode,
    color: string
}