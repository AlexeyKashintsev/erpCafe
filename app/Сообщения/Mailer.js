/**
 * JavaMail server client.
 * @name Mailer
 * 
 * context.xml:
 *
 *  <Resource name="mail/Session" auth="Container"
 *          type="javax.mail.Session" 
 *          mail.smtp.host="mail.host.com"
 *          mail.smtp.port="587"
 *          mail.smtp.auth="true"
 *          mail.smtp.starttls.enable="true"
 *          mail.smtp.user="mail@host.com"
 *          password="***"  />
 *           
 *
 * web.xml:
 *
 * <resource-ref>
 *       <description>
 *           Resource reference to a factory for javax.mail.Session
 *           instances that may be used for sending electronic mail
 *           messages, preconfigured to connect to the appropriate
 *           SMTP server.
 *       </description>
 *       <res-ref-name>
 *           mail/Session
 *       </res-ref-name>
 *       <res-type>
 *           javax.mail.Session
 *       </res-type>
 *       <res-auth>
 *           Container
 *       </res-auth>
 * </resource-ref>
 * 
 * @author vv
 * @public
 */
function Mailer() {
    var self = this, model = self.model;
    var Session = javax.mail.Session;
    var Message = javax.mail.Message;
    var Transport = javax.mail.Transport;
    var InternetAddress = javax.mail.internet.InternetAddress;
    var MimeMessage = javax.mail.internet.MimeMessage;
    var InitialContext = javax.naming.InitialContext;

    /**
     * Sends an email message.
     * @param {String} from email address
     * @param {String} to recipient email address
     * @param {String} subject message subject
     * @param {String} text message body
     * @returns {Boolean} true if the message have sent successully
     */
    self.sendEmail = function (from, to, subject, text) {
        Logger.info("Sending email message..");
        try {
            var session = constructSession();//getSession();
            var message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            message.setText(text);
            Transport.send(message);
            Logger.info("The message was sent successfully..");
            return true;
        } catch (ex) {
            Logger.severe("The message wasn't sent. Error: " + ex.toString());
            return false;
        }
    };

    function getSession() {
        var initCtx = new InitialContext();
        var envCtx = initCtx.lookup("java:comp/env");
        return envCtx.lookup("mail/Session");
    }
    
    function constructSession() {
        var properties = new java.lang.System.getProperties();
        properties.setProperty('mail.smtp.host', "smtp.gmail.com");
        properties.setProperty('mail.smtp.port', '587');
        properties.setProperty('mail.smtp.auth', 'true');
        properties.setProperty('mail.smtp.starttls.enable', 'true');
        var auth = new javax.mail.Authenticator() {
            getPasswordAuthentication: function() {
                return new javax.mail.PasswordAuthentication("pikovartur@gmail.com", "Am4076Am4076");
            }
        };
        return Session.getInstance(properties, auth);
    }
}