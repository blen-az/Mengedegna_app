import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import Colors from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon
}: ButtonProps) {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = { ...styles.button };
    
    // Variant styles
    if (variant === 'primary') {
      buttonStyle = { ...buttonStyle, ...styles.primaryButton };
    } else if (variant === 'secondary') {
      buttonStyle = { ...buttonStyle, ...styles.secondaryButton };
    } else if (variant === 'outline') {
      buttonStyle = { ...buttonStyle, ...styles.outlineButton };
    } else if (variant === 'text') {
      buttonStyle = { ...buttonStyle, ...styles.textButton };
    }
    
    // Size styles
    if (size === 'small') {
      buttonStyle = { ...buttonStyle, ...styles.smallButton };
    } else if (size === 'large') {
      buttonStyle = { ...buttonStyle, ...styles.largeButton };
    }
    
    // Disabled state
    if (disabled) {
      buttonStyle = { ...buttonStyle, ...styles.disabledButton };
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleObj: TextStyle = { ...styles.buttonText };
    
    // Variant text styles
    if (variant === 'primary') {
      textStyleObj = { ...textStyleObj, ...styles.primaryButtonText };
    } else if (variant === 'secondary') {
      textStyleObj = { ...textStyleObj, ...styles.secondaryButtonText };
    } else if (variant === 'outline') {
      textStyleObj = { ...textStyleObj, ...styles.outlineButtonText };
    } else if (variant === 'text') {
      textStyleObj = { ...textStyleObj, ...styles.textButtonText };
    }
    
    // Size text styles
    if (size === 'small') {
      textStyleObj = { ...textStyleObj, ...styles.smallButtonText };
    } else if (size === 'large') {
      textStyleObj = { ...textStyleObj, ...styles.largeButtonText };
    }
    
    // Disabled text
    if (disabled) {
      textStyleObj = { ...textStyleObj, ...styles.disabledButtonText };
    }
    
    return textStyleObj;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.white : Colors.primary}
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <>
          {icon && icon}
          <Text style={[getTextStyle(), icon && styles.textWithIcon, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.primary + '20',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  disabledButton: {
    backgroundColor: Colors.gray[300],
    borderColor: Colors.gray[300],
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.primary,
  },
  outlineButtonText: {
    color: Colors.primary,
  },
  textButtonText: {
    color: Colors.primary,
  },
  smallButtonText: {
    fontSize: 14,
  },
  largeButtonText: {
    fontSize: 18,
  },
  disabledButtonText: {
    color: Colors.gray[500],
  },
  textWithIcon: {
    marginLeft: 8,
  },
});