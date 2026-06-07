import { Resend } from "resend";
import { env } from "../env";
import type { MailAdapter } from "./send-email";

export const getResend = () => new Resend(env.RESEND_API_KEY ?? "no-key");

export const resendMailAdapter: MailAdapter = {
  send: async (params) => {
    if (!env.RESEND_API_KEY) {
      console.warn("[Resend] RESEND_API_KEY not set, skipping email send");
      return { error: null, data: { id: "skipped" } };
    }
    const result = await getResend().emails.send(params);

    if (result.error) {
      return { error: new Error(result.error.message), data: null };
    }

    return { error: null, data: { id: result.data.id } };
  },
};
