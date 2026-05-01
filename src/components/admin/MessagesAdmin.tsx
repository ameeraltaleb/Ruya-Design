import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { Trash2, Mail, MailOpen } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
  status: "new" | "read";
}

enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}
function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: { userId: auth.currentUser?.uid },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, "messages");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: Message[] = [];
        snapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() } as Message);
        });
        msgs.sort((a, b) => b.createdAt - a.createdAt);
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "messages");
      },
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الرسالة؟")) {
      try {
        await deleteDoc(doc(db, "messages", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `messages/${id}`);
      }
    }
  };

  const toggleStatus = async (msg: Message) => {
    try {
      const newStatus = msg.status === "new" ? "read" : "new";
      await updateDoc(doc(db, "messages", msg.id), {
        status: newStatus,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `messages/${msg.id}`);
    }
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div dir="rtl">
      <h1 className="text-3xl font-bold mb-8">الرسائل</h1>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-400">لا توجد رسائل حالياً.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white/5 border rounded-2xl p-6 transition-colors ${
                msg.status === "new"
                  ? "border-ruya-yellow/50"
                  : "border-white/10 opacity-70"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                <div className="w-full">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                    {msg.name}
                    {msg.status === "new" && (
                      <span className="bg-ruya-yellow text-ruya-bg text-xs px-2 py-1 rounded-full whitespace-nowrap">
                        جديد
                      </span>
                    )}
                  </h3>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-ruya-yellow hover:underline text-sm mt-1 inline-block break-all"
                  >
                    {msg.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => toggleStatus(msg)}
                    className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    title={
                      msg.status === "new" ? "تحديد كمقروء" : "تحديد كغير مقروء"
                    }
                  >
                    {msg.status === "new" ? (
                      <MailOpen className="w-5 h-5" />
                    ) : (
                      <Mail className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="text-gray-300 whitespace-pre-wrap bg-white/5 p-4 rounded-xl">
                {msg.message}
              </div>
              <div className="text-xs text-gray-500 mt-4 text-left">
                {new Date(msg.createdAt).toLocaleString("ar-EG")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
