import { Scissors, Sparkles, Check, Clock } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: typeof Scissors;
}

const services: Service[] = [
  { id: "classic-cut", name: "Classic Haircut", price: 350, duration: "30 min", icon: Scissors },
  { id: "hot-shave", name: "Hot Towel Shave", price: 400, duration: "45 min", icon: Sparkles },
  { id: "full-service", name: "The Full Service", price: 650, duration: "75 min", icon: Sparkles },
  { id: "beard-trim", name: "Beard Trim & Shape", price: 250, duration: "20 min", icon: Scissors },
  { id: "father-son", name: "Father & Son", price: 550, duration: "60 min", icon: Scissors },
  { id: "grey-blend", name: "Grey Blending", price: 450, duration: "45 min", icon: Sparkles },
];

interface ServiceSelectionProps {
  selectedService: string | null;
  onSelect: (serviceId: string) => void;
}

export function ServiceSelection({ selectedService, onSelect }: ServiceSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Select a Service</h2>
        <p className="text-navy-500">Choose the service that suits you best</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = selectedService === service.id;
          const Icon = service.icon;

          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={`
                relative p-5 rounded-xl border text-left transition-all duration-200
                ${isSelected
                  ? "border-brass-400 bg-brass-50 ring-2 ring-brass-400"
                  : "border-cream-200 bg-cream-50 hover:border-brass-300 hover:bg-white"
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl transition-colors ${
                    isSelected ? "bg-brass-400 text-navy-900" : "bg-cream-200 text-navy-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-navy-900 mb-1">{service.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-navy-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-brass-600">{service.price} kr</p>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 rounded-full bg-brass-400 flex items-center justify-center">
                    <Check className="w-4 h-4 text-navy-900" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
