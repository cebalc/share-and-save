
export function scrollIntoContactData(): void {
    // let contactDataNode = document.getElementById("contact-data");
    // contactDataNode != null && contactDataNode.scrollIntoView();
    scrollIntoHTMLElement("contact-data");
}

export function scrollIntoHTMLElement(id: string): void {
    let node = document.getElementById(id);
    node != null && node.scrollIntoView();
}

export function formatEUR(amount: number): string {
    return amount.toLocaleString("es-ES", {style: "currency", currency: "EUR"});
}