
export class CommonMethods {
    public static getItem(item: any) {
        return localStorage.getItem(item);
    }

    public static setItem(itemName: any, itemValue: any) {
        localStorage.setItem(itemName, itemValue);
    }

    public static removeItem(item: any) {
        localStorage.removeItem(item);
    }
}