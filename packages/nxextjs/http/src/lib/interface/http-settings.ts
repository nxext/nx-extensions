export type SSLSettings = {
  certFile: string;
  keyFile: string;
};

export type HTTPSettings = {
  hostname: string;
  port: number;
  SSL: SSLSettings;
};
