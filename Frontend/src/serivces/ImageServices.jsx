import AppConfig from '../core/config';

const fetchHealthCheck = async () => {
    const url = `${AppConfig.api_base_url}/images/health-check`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
        credentials: 'include',
    });

    if (response.status === 401 || response.status === 422) {
        const refreshResponse = await fetchRefresh();

        if (refreshResponse.status === 200) {
            const retryResponse = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
                credentials: 'include',
            });

            return retryResponse;
        }
    }

    return response;
};

const fetchAnalyzeImage = async (filename) => {
    const url = `${AppConfig.api_base_url}/images/analyze/${filename}`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
        credentials: 'include',
    });

    if (response.status === 401 || response.status === 422) {
        const refreshResponse = await fetchRefresh();

        if (refreshResponse.status === 200) {
            const retryResponse = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
                credentials: 'include',
            });

            return retryResponse;
        }
    }

    return response;
};


const fetchAnalyzeResult = async (fileName) => {
    const url = `${AppConfig.api_base_url}/images/result/${fileName}`;
    console.log("Fetching analyze result from URL:", url);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
        credentials: 'include',
    });

    if (response.status === 401 || response.status === 422) {
        const refreshResponse = await fetchRefresh();

        if (refreshResponse.status === 200) {
            const retryResponse = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
                credentials: 'include',
            });

            return retryResponse;
        }
    }

    return response;
};

const fetchUploadImage = async (file) => {
    const url = `${AppConfig.api_base_url}/images/upload`;
    const formData = new FormData();
    formData.append('file', file);

    console.log("Uploading image to URL:", url);
    
    const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });

    if (response.status === 401 || response.status === 422) {
        const refreshResponse = await fetchRefresh();

        if (refreshResponse.status === 200) {
            const retryResponse = await fetch(url, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            return retryResponse;
        }
    }

    return response;
};

export { fetchHealthCheck, fetchAnalyzeImage, fetchAnalyzeResult, fetchUploadImage };