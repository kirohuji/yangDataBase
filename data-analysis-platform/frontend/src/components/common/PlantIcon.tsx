import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

interface PlantIconProps extends Omit<SvgIconProps, 'children'> {
  variant?: 'leaf' | 'flower' | 'tree';
}

const PlantIcon: React.FC<PlantIconProps> = ({ variant = 'leaf', ...props }) => {
  const getPath = () => {
    switch (variant) {
      case 'flower':
        return (
          <>
            {/* 花朵 */}
            <circle cx="12" cy="8" r="2" fill="#FF6B9D" />
            <circle cx="8" cy="10" r="1.5" fill="#FF8FB3" />
            <circle cx="16" cy="10" r="1.5" fill="#FF8FB3" />
            <circle cx="10" cy="12" r="1.5" fill="#FF8FB3" />
            <circle cx="14" cy="12" r="1.5" fill="#FF8FB3" />
            <circle cx="12" cy="10" r="1" fill="#FFE066" />
            {/* 茎 */}
            <rect x="11.5" y="12" width="1" height="8" fill="#4CAF50" />
            {/* 叶子 */}
            <path d="M9 16 Q7 14 9 12 Q11 14 9 16" fill="#66BB6A" />
            <path d="M15 18 Q17 16 15 14 Q13 16 15 18" fill="#66BB6A" />
          </>
        );
      case 'tree':
        return (
          <>
            {/* 树冠 */}
            <circle cx="12" cy="8" r="6" fill="#4CAF50" />
            <circle cx="10" cy="10" r="4" fill="#66BB6A" />
            <circle cx="14" cy="6" r="3" fill="#81C784" />
            {/* 树干 */}
            <rect x="10" y="14" width="4" height="6" fill="#8D6E63" />
            {/* 根部 */}
            <path d="M10 20 Q8 22 6 20 M14 20 Q16 22 18 20" stroke="#A1887F" strokeWidth="1" fill="none" />
          </>
        );
      default: // leaf
        return (
          <>
            {/* 主叶片 */}
            <path 
              d="M12 4 Q18 8 16 14 Q14 18 12 16 Q10 18 8 14 Q6 8 12 4" 
              fill="#4CAF50" 
            />
            {/* 叶脉 */}
            <path 
              d="M12 4 L12 16 M12 8 Q10 10 8 12 M12 8 Q14 10 16 12 M12 12 Q10 14 8 16 M12 12 Q14 14 16 16" 
              stroke="#2E7D32" 
              strokeWidth="0.5" 
              fill="none" 
            />
            {/* 茎 */}
            <rect x="11.5" y="16" width="1" height="4" fill="#388E3C" />
          </>
        );
    }
  };

  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {getPath()}
    </SvgIcon>
  );
};

export default PlantIcon;
