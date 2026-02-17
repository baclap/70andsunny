export default function GoogleMap() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d957.5209099450778!2d-122.35415254284817!3d47.61504987231362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54901503ff47b3bb%3A0xf1b68e44977ab984!2s70%20and%20Sunny%20Coffee%20Co.!5e0!3m2!1sen!2sus!4v1771304268416!5m2!1sen!2sus"
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg"
      />
    </div>
  );
}
