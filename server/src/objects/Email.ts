import { Address } from "nodemailer/lib/mailer";
import Mail from "nodemailer/lib/mailer";

class Email implements Mail.Options {
    private static DEF_SUBJECT = "(no subject)";
    private static DEF_BODY = "(no body)";

    public from: Address;
    public to: Address[];
    public cc?: Address[];
    public bcc?: Address[];
    public replyTo: Address;
    public subject: string;
    public text: string;
    public html: string;

    public constructor(from: Address, ...to: Address[]) {
        this.from = from;
        this.to = to;
        this.subject = Email.DEF_SUBJECT;
        this.text = Email.DEF_BODY;
        this.html = Email.DEF_BODY;
        this.replyTo = this.from;
    }

    public mayBeSent(): boolean {
        //Check required fields
        return this.to != null && this.to.length > 0;
    }
}

export default Email;