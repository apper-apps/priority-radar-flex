import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import EmojiReaction from "@/components/molecules/EmojiReaction";
import { checkInService } from "@/services/api/checkInService";

const CheckInForm = ({ onCheckInComplete, currentUser }) => {
  const [priorities, setPriorities] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
const [showCelebration, setShowCelebration] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!priorities.trim()) {
      toast.error("Please add at least one priority for today! 📝");
      return;
    }

    // Validate that there's meaningful content
    const priorityList = priorities
      .split("\n")
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (priorityList.length === 0) {
      toast.error("Please add at least one priority for today! 📝");
      return;
}

    setIsSubmitting(true);
    
    try {
      console.log("Creating check-in for user:", currentUser.id, "with priorities:", priorityList);
      await checkInService.createCheckIn(currentUser.id, priorityList);
      
      setShowCelebration(true);
      toast.success("Great! Your priorities are set for today! 🎯");
      setPriorities("");
      
      // Small delay to let user see the success message before transitioning
      setTimeout(() => {
        onCheckInComplete?.();
      }, 1000);
      
} catch (error) {
      console.error("Check-in error:", error);
      toast.error(`Oops! Something went wrong: ${error.message}. Please try again. 😅`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Target" size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Good morning! ☀️
            </h2>
            <p className="text-gray-600 font-medium">
              What are you planning to accomplish today?
            </p>
          </div>

<form onSubmit={handleSubmit} className="space-y-6">
            <TextArea
              label="Today's Priorities"
              placeholder="• Finish the presentation for tomorrow's meeting&#10;• Review and approve the marketing campaign&#10;• Call the client about project updates&#10;• Organize team lunch for Friday"
              value={priorities}
              onChange={(e) => setPriorities(e.target.value)}
              rows={6}
              className="text-lg leading-relaxed"
            />

            <div className="flex items-center space-x-3 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <ApperIcon name="Info" size={16} className="text-blue-600" />
              <p>
                <strong className="text-blue-800">Pro tip:</strong> 
                Write each priority on a new line and be specific about what success looks like!
              </p>
            </div>

            {/* Character counter */}
            <div className="text-right text-sm text-gray-500">
              {priorities.length}/500 characters
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || !priorities.trim()}
              className="w-full font-bold text-lg py-4 cursor-pointer hover:scale-105 transition-all duration-200"
              onClick={(e) => {
                console.log("Button clicked!", e);
                // Ensure form submission isn't blocked
                if (!isSubmitting && priorities.trim()) {
                  handleSubmit(e);
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Setting your focus...
                </>
              ) : (
                <>
                  <ApperIcon name="Send" size={20} className="mr-2" />
                  Set Today's Focus 🎯
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </Card>
      
      <EmojiReaction 
        trigger={showCelebration} 
        emojis={["🎯", "✨", "🚀", "💪"]} 
      />
    </>
  );
};

export default CheckInForm;