'use client';

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: number;
  className?: string;
}

export default function CategoryIcon({ icon, color, size = 20, className = '' }: CategoryIconProps) {
  // Icon mapping - admin panelindeki iconlar ile uyumlu
  const getIconSvg = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'cube':
      case 'box':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" />
          </svg>
        );
      case 'cleaning':
      case 'spray':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9M7 6H17V19H7V6M9 8V17H11V8H9M13 8V17H15V8H13Z" />
          </svg>
        );
      case 'paper':
      case 'document':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      case 'food':
      case 'restaurant':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.1,13.34L3.91,9.16C2.35,7.59 2.35,5.06 3.91,3.5L10.93,10.5L8.1,13.34M14.88,11.53C16.71,12.67 19.33,12.29 20.9,10.72C22.46,9.15 22.08,6.53 20.95,4.7L18.54,7.11C18.15,7.5 17.71,7.5 17.32,7.11C16.93,6.72 16.93,6.28 17.32,5.89L19.73,3.48C17.9,2.35 15.28,2.73 13.71,4.3C12.14,5.86 11.76,8.48 12.9,10.31L5.4,17.81C4.22,19 4.22,20.9 5.4,22.08C6.59,23.27 8.49,23.27 9.67,22.08L17.17,14.58C17.96,15.22 18.78,15.54 19.58,15.54C20.18,15.54 20.77,15.39 21.33,15.09L14.88,11.53Z" />
          </svg>
        );
      case 'office':
      case 'briefcase':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
          </svg>
        );
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          </svg>
        );
    }
  };

  return (
    <div 
      className={`flex items-center justify-center rounded-lg ${className}`}
      style={{ color }}
    >
      {getIconSvg(icon)}
    </div>
  );
}
