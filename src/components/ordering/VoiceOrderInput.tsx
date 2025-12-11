import { useState, useRef } from "react";
import { Mic, MicOff, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface VoiceOrderInputProps {
  onOrderSubmit?: (orderText: string) => void;
  placeholder?: string;
}

const VoiceOrderInput = ({
  onOrderSubmit,
  placeholder = "Type your order here or use voice input...\n\nExample:\n3 kg tomatoes\n2 bundles plantain\n1 kg fresh fish",
}: VoiceOrderInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderText, setOrderText] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        setTimeout(() => {
          const simulatedTranscription = "2 kg tomatoes, 1 bunch of plantain, half kg of fresh tilapia";
          setOrderText((prev) => prev + (prev ? "\n" : "") + simulatedTranscription);
          setIsProcessing(false);
          toast.success("Voice note transcribed!");
        }, 2000);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording... Speak your order");
    } catch {
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (!orderText.trim()) {
      toast.error("Please enter your order");
      return;
    }
    onOrderSubmit?.(orderText);
    toast.success("Order submitted!");
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="relative">
          <Textarea
            value={orderText}
            onChange={(e) => setOrderText(e.target.value)}
            placeholder={placeholder}
            className="min-h-32 pr-12 resize-none"
          />
          
          <Button
            type="button"
            variant={isRecording ? "destructive" : "secondary"}
            size="icon"
            className="absolute bottom-2 right-2"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 text-sm text-destructive animate-pulse">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            Recording... Tap to stop
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="hero"
            className="flex-1"
            onClick={handleSubmit}
            disabled={!orderText.trim() || isRecording || isProcessing}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Order
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Tip: You can speak naturally, e.g., "I need 2 kilos of tomatoes and some plantains"
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceOrderInput;
