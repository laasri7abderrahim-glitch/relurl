"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, Clock, Loader2, Check } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const sidebarItems = [
  { icon: Mail, labelKey: "sidebarEmail", valueKey: "sidebarEmailValue" },
  { icon: MapPin, labelKey: "sidebarLocation", valueKey: "sidebarLocationValue" },
  { icon: Phone, labelKey: "sidebarPhone", valueKey: "sidebarPhoneValue" },
  { icon: Clock, labelKey: "sidebarHours", valueKey: "sidebarHoursValue" },
];

export default function ContactPageClient() {
  const t = useTranslations("contact")
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">{t("title")}</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {t("subtitle")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    {sent ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Check className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{t("successTitle")}</h3>
                        <p className="text-muted-foreground">{t("successDesc")}</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-1 block">{t("nameLabel")}</label>
                            <Input placeholder={t("namePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">{t("emailLabel")}</label>
                            <Input type="email" placeholder={t("emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} required />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">{t("subjectLabel")}</label>
                          <Input placeholder={t("subjectPlaceholder")} value={subject} onChange={(e) => setSubject(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">{t("messageLabel")}</label>
                          <Textarea placeholder={t("messagePlaceholder")} rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full" disabled={sending}>
                          {sending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("sendingText")}</> : t("sendButton")}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                {sidebarItems.map((item, i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">{t(item.labelKey)}</div>
                        <div className="text-sm font-medium">{t(item.valueKey)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
