import * as React from 'react';

interface verificationEmailProps{
  username: string;
  otp:string;
}

export function EmailTemplate({ username, otp }: verificationEmailProps) {
  return (
    <div>
      <h1>Welcome, {username} your OTP is {otp}</h1>
    </div>
  );
}