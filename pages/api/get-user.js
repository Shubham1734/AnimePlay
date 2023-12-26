// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/user";
import connectDb from "@/middleware/mongoose";
import crypto from "crypto";

export const EncryptorDecryptor = ({ type, text }) => {
  if (type === "encrypt") {
    const hash = crypto.createHash("sha256").update(text).digest("hex");
    return hash;
  } else if (type === "decrypt") {
    // Decryption not possible with SHA-256
    throw new Error("Decryption not possible with SHA-256");
  } else {
    throw new Error("Invalid type parameter");
  }
};

const handler = async (req, res) => {
  if (req.method == "POST") {
    const u = await User.find({ username: req.body.username });

    if (Object.keys(u).length !== 0) {
      const u_password = u[0].password;
      if (
        EncryptorDecryptor({
          type: "encrypt",
          text: req.body.password,
        }) === u_password ||
        u_password === req.body.password
      ) {
        res.status(200).json(u);
      } else {
        res.status(400).json({
          error: "Incorrect Password",
        });
      }
    } else {
      res.status(400).json({ error: "This Username don't exist" });
    }
  } else {
    console.log(req.method);
    res.status(400).json({ error: "Post Only API" });
  }
};

export default connectDb(handler);
