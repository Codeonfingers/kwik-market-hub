import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePayments } from "@/hooks/usePayments";

interface MomoPaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  onSuccess: () => void;
}

const MomoPaymentModal = ({
  open,
  onClose,
  orderId,
  amount,
  onSuccess,
}: MomoPaymentModalProps) => {
  const { initiatePayment, processing } = usePayments();
  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState<"mtn" | "vodafone" | "airteltigo">("mtn");
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    if (!phone || phone.length < 10) return;

    const { error } = await initiatePayment(orderId, amount, phone, network);
    
    if (!error) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Mobile Money Payment</DialogTitle>
          <DialogDescription>
            Pay ₵{amount.toFixed(2)} securely with Mobile Money
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-8 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground">Your order has been confirmed.</p>
          </motion.div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Network</Label>
              <Select value={network} onValueChange={(v) => setNetwork(v as typeof network)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtn">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-yellow-400 flex items-center justify-center text-xs font-bold">
                        M
                      </div>
                      MTN Mobile Money
                    </div>
                  </SelectItem>
                  <SelectItem value="vodafone">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center text-xs font-bold text-white">
                        V
                      </div>
                      Vodafone Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="airteltigo">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-xs font-bold text-white">
                        AT
                      </div>
                      AirtelTigo Money
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="0244123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Amount</span>
                <span className="font-semibold">₵{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Transaction Fee</span>
                <span className="font-semibold">₵0.00</span>
              </div>
              <div className="border-t mt-2 pt-2 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-display text-lg font-bold text-primary">
                  ₵{amount.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              variant="hero"
              className="w-full"
              onClick={handlePayment}
              disabled={processing || phone.length < 10}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₵${amount.toFixed(2)}`
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              You will receive a prompt on your phone to authorize the payment.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MomoPaymentModal;
