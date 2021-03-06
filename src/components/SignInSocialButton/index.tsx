import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";
import { SvgProps } from "react-native-svg";

import { Button, SocialIconContainer, Title } from "./styles";

interface SignInSocialButtonProps extends RectButtonProps {
  title: string;
  svg: React.FC<SvgProps>;
}

export const SignInSocialButton = ({
  title,
  svg: Svg,
  ...rest
}: SignInSocialButtonProps) => {
  return (
    <Button {...rest}>
      <SocialIconContainer>
        <Svg />
      </SocialIconContainer>

      <Title>{title}</Title>
    </Button>
  );
};
