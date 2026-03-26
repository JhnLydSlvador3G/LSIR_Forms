export function getLoginErrorMessage(statusCode: number): string {
    switch (true) {
        // ✅ Success
        case statusCode === 200:
            return "Login successful!";

        // 300–399 Redirects
        case statusCode >= 300 && statusCode < 400:
            return "Unexpected redirect. Please try again.";

        // 400–499 Client Errors
        case statusCode === 400:
            return "Invalid request. Please check your input.";
        case statusCode === 401:
            return "Incorrect email or password.";
        case statusCode === 403:
            return "Your account is not authorized to log in.";
        case statusCode === 404:
            return "Login service not found. Please try again later.";
        case statusCode === 429:
            return "Too many login attempts. Please wait and try again.";

        // 500–599 Server Errors
        case statusCode >= 500 && statusCode < 600:
            switch (statusCode) {
                case 500:
                    return "Server error. Please try again later.";
                case 502:
                    return "Server unavailable. Please try again later.";
                case 503:
                    return "Service temporarily unavailable. Try again shortly.";
                case 504:
                    return "Login timed out. Please retry.";
                default:
                    return "Server error. Please try again later.";
            }

        // Fallback for unknown codes
        default:
            return "Login failed. Please try again.";
    }
}