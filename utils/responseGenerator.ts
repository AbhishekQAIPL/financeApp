
function generateServiceResponse(obj: any, functionName: string,) {
    console.log({ ...obj, functionName })
    return obj;
}

export function generateValidationResponse(functionName: string, message: string, error: any) {
    return generateServiceResponse({
        code: "VALIDATION",
        message: message,
        data: undefined,
        error,
    },
        functionName
    )
}

export function generateSuccessResponse(functionName: string, message: string, data: any) {
    return generateServiceResponse({
        code: "SUCCESS",
        message,
        error: undefined,
        data,
    },
        functionName
    )
}

export function generateFaliureResponse(functionName: string, message: string, error: any) {
    return generateServiceResponse({
        code: "FALIURE",
        message,
        error,
        data: undefined,
    },
        functionName
    )
}

export function generateUnAuthorizeResponse(functionName: string) {
    return generateServiceResponse({
        code: "UNAUTHORIZED",
        message: "Unauthorized user",
        error: "user not found",
        data: undefined,
    },
        functionName
    )
}