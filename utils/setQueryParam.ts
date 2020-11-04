export default function setQueryParam(query: any, param: string, value: any, prefix?: string): any {
    const clone = {...query};
    let queryParam = param;
    if (prefix) {
        queryParam = `${prefix}_${param}`
    }

    clone[queryParam] = value;
    return clone;
}
