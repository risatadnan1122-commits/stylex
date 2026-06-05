import React, { useState } from 'react';
import { Star, MessageSquareCode, CheckCircle, ShieldAlert } from 'lucide-react';
import { Review } from '../types';

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  onAddReview: (productId: string, rating: number, comment: string, name: string) => void;
}

export default function ReviewSection({
  productId,
  reviews,
  onAddReview
}: ReviewSectionProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [success, setSuccess] = useState('');

  const filtered = reviews.filter(r => r.product_id === productId && r.approved);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !name.trim()) return;
    onAddReview(productId, rating, comment.trim(), name.trim());
    
    // Clear Form
    setComment('');
    setName('');
    setRating(5);
    setSuccess('Thank you. Your review has been submitted to the moderation inbox for luxury verification.');
    
    setTimeout(() => {
      setSuccess('');
    }, 4000);
  };

  return (
    <div className="space-y-6 pt-6 border-t border-gold-border/20">
      
      {/* Title */}
      <div className="flex items-center space-x-2">
        <MessageSquareCode className="h-4.5 w-4.5 text-gold-accent" />
        <h4 className="serif-title text-sm font-semibold uppercase tracking-wider text-white">
          Client Appraisals ({filtered.length})
        </h4>
      </div>

      {/* Appraisals feedback */}
      {filtered.length === 0 ? (
        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">No appraisals catalogued yet. Be the first to verify.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((rev) => (
            <div key={rev.id} className="p-3 bg-black/40 border border-gold-border/10 rounded font-sans text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">{rev.customer_name}</span>
                <div className="flex text-gold-accent">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="h-3 w-3 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-400 italic">"{rev.comment}"</p>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Formulation Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-black/60 border border-gold-border/20 rounded space-y-3.5">
        <span className="text-[10px] font-mono text-gold-accent uppercase tracking-widest block">Log Appraisal Verification</span>

        {success && (
          <div className="p-3 bg-green-950/20 border border-green-500/25 text-green-300 rounded text-xs leading-relaxed flex items-center space-x-2 font-mono">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-400" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-mono text-gray-500 block mb-1">Your Name</label>
            <input
              type="text"
              required
              placeholder="E.g. Sterling Cooper"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black text-xs text-white border border-gold-border/30 px-3 py-2 focus:outline-none focus:border-gold-accent rounded"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-gray-500 block mb-1">Rating Appraisal</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full bg-black text-xs text-gold-accent border border-gold-border/30 px-3 py-2 focus:outline-none focus:border-gold-accent rounded"
            >
              <option value="5">★★★★★ Exceptional (5/5)</option>
              <option value="4">★★★★ Very Fine (4/5)</option>
              <option value="3">★★★ Acceptable (3/5)</option>
              <option value="2">★★ Disappointing (2/5)</option>
              <option value="1">★ Deficient (1/5)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-gray-500 block mb-1">Verification Commentary</label>
          <textarea
            required
            rows={2}
            placeholder="The fit is outstanding. The double stitching feels beautifully dense..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-black text-xs text-white border border-gold-border/30 px-3 py-2 focus:outline-none focus:border-gold-accent rounded resize-none"
          />
        </div>

        <div className="flex justify-between items-center pt-1.5">
          <div className="flex items-center space-x-1.5 text-[8.5px] font-mono text-gray-500 uppercase">
            <ShieldAlert className="h-3.5 w-3.5 text-gold-accent" />
            <span>Subject to high-end moderation controls</span>
          </div>
          
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-gold-secondary to-gold-accent text-black font-semibold font-mono text-[10px] tracking-widest uppercase rounded cursor-pointer"
          >
            File Appraisal
          </button>
        </div>
      </form>

    </div>
  );
}
