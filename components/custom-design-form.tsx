"use client";
import { useState } from "react";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function CustomDesignForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form className="contact-form custom-design-form" encType="multipart/form-data" onSubmit={async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const image = data.get("image");
      if (!(image instanceof File) || !image.size) { setStatus("Please choose a design image."); return; }
      if (!IMAGE_TYPES.includes(image.type) || image.size > MAX_IMAGE_BYTES) { setStatus("Choose a JPG, PNG, or WebP image no larger than 3 MB."); return; }
      setBusy(true); setStatus("");
      try {
        const response = await fetch("/api/custom-designs", { method: "POST", body: data });
        const result = await response.json();
        setStatus(result.message || "We couldn’t submit your request.");
        if (response.ok) form.reset();
      } catch { setStatus("We couldn’t submit your request. Please try again shortly."); }
      finally { setBusy(false); }
    }}>
      <h2>Tell us about your dress.</h2>
      <label htmlFor="custom-name">Your name</label>
      <input id="custom-name" name="name" autoComplete="name" required maxLength={100} />
      <label htmlFor="custom-email">Email address</label>
      <input id="custom-email" name="email" type="email" autoComplete="email" required maxLength={254} />
      <label htmlFor="custom-phone">Phone number</label>
      <input id="custom-phone" name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} />
      <label htmlFor="custom-address">Delivery address</label>
      <textarea id="custom-address" name="deliveryAddress" autoComplete="street-address" required minLength={10} maxLength={500} rows={3} />
      <label htmlFor="custom-notes">Anything else we should know? <span>(optional)</span></label>
      <textarea id="custom-notes" name="notes" maxLength={2000} rows={4} placeholder="Occasion, preferred colour, timeline, or other details" />
      <label htmlFor="custom-image">Design picture</label>
      <input id="custom-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required />
      <small>JPG, PNG, or WebP · maximum 3 MB</small>
      <button className="button" type="submit" disabled={busy}>{busy ? "Sending…" : "Send my design →"}</button>
      <p role="status" aria-live="polite">{status}</p>
    </form>
  );
}
