import nodemailer, { Transporter } from "nodemailer";
import path from "path";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Email from "./Email";

class Mailer {
    private static MSG_CANNOT_SEND = "The email cannot be sent";

    private static getSMTPVars(): SMTPTransport.Options {
        let jsonData: Object = require(path.resolve(__dirname, "../..", "mail.json"));
        return <SMTPTransport.Options>jsonData;
    }
    
    private transporter: Transporter<SMTPTransport.SentMessageInfo>;
    private email: Email;

    public constructor(email: Email = null) {
        this.transporter = nodemailer.createTransport(Mailer.getSMTPVars());
        this.email = email;
    }

    public setCurrentEmail(email: Email): void {
        this.email = email;
    }

    private async maySendCurrentEmail(): Promise<boolean> {
        let smtpOK: boolean = await this.transporter.verify();
        return smtpOK && this.email != null && this.email.mayBeSent();
    }

    public async sendCurrentMail(): Promise<boolean> {
        try {
            if(!await this.maySendCurrentEmail()) {
                throw Mailer.MSG_CANNOT_SEND;
            }
            //Code to send email
            await this.transporter.sendMail(this.email);
            return true;
        } catch(error) {
            console.log(`Error: ${error}`);
            return false;
        }
    }
}

export default Mailer;