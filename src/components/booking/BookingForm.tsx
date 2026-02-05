import { User, Mail, Phone, MessageSquare } from "lucide-react";

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface BookingFormProps {
  userDetails: UserDetails;
  onChange: (details: UserDetails) => void;
}

export function BookingForm({ userDetails, onChange }: BookingFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({ ...userDetails, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Your Details</h2>
        <p className="text-navy-500">We'll use this to confirm your booking</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-navy-700 flex items-center gap-2">
            <User className="w-4 h-4" />
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            placeholder="Your full name"
            value={userDetails.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-cream-200 bg-cream-50 px-4 py-3 text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brass-400 focus:border-brass-400 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-navy-700 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={userDetails.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-cream-200 bg-cream-50 px-4 py-3 text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brass-400 focus:border-brass-400 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-navy-700 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+46 70 123 45 67"
            value={userDetails.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-cream-200 bg-cream-50 px-4 py-3 text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brass-400 focus:border-brass-400 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium text-navy-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Special Requests (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Any specific preferences or requests..."
            value={userDetails.notes}
            onChange={handleChange}
            className="w-full rounded-lg border border-cream-200 bg-cream-50 px-4 py-3 text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brass-400 focus:border-brass-400 transition-all resize-none"
          />
        </div>
      </div>

      <div className="bg-brass-50 rounded-lg p-4 border border-brass-200">
        <p className="text-sm text-navy-600">
          <strong className="text-navy-900">Note:</strong> We'll send a confirmation email with your
          time and booking details. Please arrive 5 minutes before your appointment time.
        </p>
      </div>
    </div>
  );
}
