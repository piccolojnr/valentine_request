import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SocialShare } from "./SocialShare";

// Update the main component to use the new SocialShare component
export default function PreviewRequest() {
  const { id } = useParams();
  const [requestData, setRequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/view/${id}`;

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const { data, error } = await supabase
          .from("valentine_requests")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setRequestData(data);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Could not load request details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleShare = (
    title: string,
    description: string,
    variant: any = "default"
  ) => {
    toast({
      title,
      description,
      variant,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{error}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border border-rose-100 rounded-xl">
        <CardHeader>
          <CardTitle className="text-center font-serif text-2xl text-gray-800">
            Your Valentine Request is Ready
          </CardTitle>
          <p className="text-center text-rose-600 font-light">
            Share the love with someone special
          </p>
        </CardHeader>
        <CardContent>
          <SocialShare
            requestData={requestData}
            shareUrl={shareUrl}
            onShare={handleShare}
          />
        </CardContent>
      </Card>
    </div>
  );
}
