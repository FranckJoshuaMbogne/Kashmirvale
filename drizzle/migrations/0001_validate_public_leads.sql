ALTER TABLE public.enquiries
  ADD CONSTRAINT enquiries_name_trimmed_check CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
  ADD CONSTRAINT enquiries_phone_digits_check CHECK (char_length(regexp_replace(phone, '[^0-9]', '', 'g')) BETWEEN 6 AND 20),
  ADD CONSTRAINT enquiries_email_format_check CHECK (email IS NULL OR email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  ADD CONSTRAINT enquiries_status_allowed_check CHECK (status IN ('new', 'contacted', 'quoted', 'closed')),
  ADD CONSTRAINT enquiries_message_trimmed_check CHECK (message IS NULL OR char_length(btrim(message)) <= 1000);
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_author_trimmed_check CHECK (char_length(btrim(author_name)) BETWEEN 1 AND 80),
  ADD CONSTRAINT reviews_comment_trimmed_check CHECK (char_length(btrim(comment)) BETWEEN 5 AND 1000),
  ADD CONSTRAINT reviews_destination_trimmed_check CHECK (destination IS NULL OR char_length(btrim(destination)) <= 80);