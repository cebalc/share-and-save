import Contact from "./Contact";

class Email {
    private static DEF_SUBJECT = "(no subject)";
    private static DEF_BODY = "(no body)";

    private from: Contact;
    private to: Contact[];
    private cc: Contact[];
    private bcc: Contact[];
    private subject: string;
    private textBody: string;
    private htmlBody: string;

    public constructor(from: Contact, ...to: Contact[]) {
        this.from = from;
        this.to = to;
        this.subject = Email.DEF_SUBJECT;
        this.textBody = Email.DEF_BODY;
        this.htmlBody = Email.DEF_BODY;
    }

    public mayBeSent(): boolean {
        //Check required fields
        return true;
    }
}

export default Email;