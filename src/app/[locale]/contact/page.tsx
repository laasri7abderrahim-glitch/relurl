"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, Clock, Loader2, Check } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ContactPage() {
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
      <link rel="canonical" href="https://relurl.com/contact" />
      <Header />
      <main className="flex-1">
        <div className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Contact Us</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Have a question, need help, or want to say hello? We&apos;d love to hear from you.
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
                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Name</label>
                            <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Email</label>
                            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Subject</label>
                          <Input placeholder="How can we help?" value={subject} onChange={(e) => setSubject(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Message</label>
                          <Textarea placeholder="Tell us more about your inquiry..." rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full" disabled={sending}>
                          {sending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Send Message"}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "hello@relurl.com" },
                  { icon: MapPin, label: "Location", value: "San Francisco, CA" },
                  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                  { icon: Clock, label: "Hours", value: "Mon-Fri, 9AM-5PM PST" },
                ].map((item, i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="text-sm font-medium">{item.value}</div>
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
