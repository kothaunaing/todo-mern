import { v4 as uuidv4 } from "uuid";

export default function generateUniqueId() {
  const id = uuidv4();

  return id;
}
