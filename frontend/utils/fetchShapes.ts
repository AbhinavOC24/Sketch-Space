import axios from "axios";

export async function getExistingShape(roomId: string) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/${roomId}`
  );

  const message = res.data;

  const shapes = message.map((message: any) => {
    const messageData = JSON.parse(message.message);
    return messageData.shape;
  });
  shapes.sort((a: any, b: any) => Number(a.createdAt) - Number(b.createdAt));

  return shapes;
}
