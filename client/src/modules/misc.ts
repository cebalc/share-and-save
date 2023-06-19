
export function scrollIntoContactData(): void {
    let contactDataNode = document.getElementById("contact-data");
    contactDataNode != null && contactDataNode.scrollIntoView();
}

export function formatEUR(amount: number): string {
    return amount.toLocaleString("es-ES", {style: "currency", currency: "EUR"});
}