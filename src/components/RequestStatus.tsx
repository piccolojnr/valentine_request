import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Clock, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Request {
  id: string;
  recipient_name: string;
  sender_name: string;
  accepted: boolean;
  created_at: string;
  updated_at: string;
}

export default function RequestStatus() {
  const { id } = useParams();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data, error } = await supabase
          .from("valentine_requests")
          .select(
            "id, recipient_name, sender_name, accepted, created_at, updated_at"
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        setRequest(data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Could not load request status",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();

    // Set up real-time subscription
    const subscription = supabase
      .channel("request_status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "valentine_requests",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setRequest(payload.new as Request);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Heart className="w-12 h-12 text-rose-400" />
        </motion.div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h2 className="text-xl font-serif text-gray-800">
              Request not found
            </h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center font-serif text-2xl text-gray-800">
            Valentine Request Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="text-center">
            <motion.div
              animate={request.accepted ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              {request.accepted ? (
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              ) : (
                <Clock className="w-16 h-16 text-rose-400 mx-auto" />
              )}
            </motion.div>

            <h3 className="mt-4 text-xl font-medium text-gray-800">
              {request.accepted
                ? "Love Accepted! 💝"
                : "Awaiting Response... 💌"}
            </h3>
          </div>

          <div className="space-y-3 bg-rose-50/50 rounded-lg p-4 border border-rose-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">From:</span>
              <span className="font-medium text-gray-800">
                {request.sender_name}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">To:</span>
              <span className="font-medium text-gray-800">
                {request.recipient_name}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sent:</span>
              <span className="font-medium text-gray-800">
                {new Date(request.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {request.accepted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-2"
            >
              <p className="text-green-600 font-medium">
                Accepted on {new Date(request.updated_at).toLocaleDateString()}
              </p>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-2xl">💖</span>
              </motion.div>
            </motion.div>
          )}

          <Button
            className="w-full bg-rose-500 hover:bg-rose-600 text-white transition-all duration-300"
            onClick={() => (window.location.href = `/view/${request.id}`)}
          >
            View Request
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
