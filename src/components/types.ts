export interface FormData {
    // Step 1
    name: string;
    displayName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    // Step 2
    companyName: string;
    companyDisplayName: string;
    companyDescription: string;
    // Step 3
    domainName: string;
    domainDescription: string;
}
