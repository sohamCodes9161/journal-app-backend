import crypto from "crypto";

import { env } from "../config/env.js";

const algorithm = "aes-256-cbc";

const key = Buffer.from(env.AES_SECRET_KEY);

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");

  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
};

const decrypt = ({ iv, encryptedData }) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(encryptedData, "hex", "utf8");

  decrypted += decipher.final("utf8");

  return decrypted;
};

export { encrypt, decrypt };
