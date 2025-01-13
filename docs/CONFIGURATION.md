This document provides details on how to configure the application, manage environment variables, and use the VEDA UI configuration provider.

## Environment variables

The application uses `.env` and `.env.local` files to manage environment variables. Below is a breakdown of the variables used in the application:

### `.env` variables

The following variables are used to configure the API endpoints for the application:

- **`NEXT_PUBLIC_API_STAC_ENDPOINT`**
    Defines the endpoint for accessing the STAC API

    Example:
    ```env
    NEXT_PUBLIC_API_STAC_ENDPOINT='https://openveda.cloud/api/stac'
    NEXT_PUBLIC_API_RASTER_ENDPOINT='https://openveda.cloud/api/raster'
    ```

These variables are committed to the repository as they are not sensitive and are used for public API access.

### `.env variables`

These variables are used for local development and are specific to each developer’s environment. These variables are not committed to version control.

The repository includes a sample `.env.local.sample` file to guide developers in setting these up. Please copy this file, rename it to .env.local and fill it with the required credentials and tokens.

### Using environment variables in code

The `VedaUIProvider` is part of the `@developmentseed/veda-ui` library and is used to pass environment variables to VEDA-UI components. This is needed so that VEDA components relying on configurations like API endpoints and Mapbox tokens can access these values.

#### Where to place it

The `VedaUIProvider` should wrap your application at a high level, such as in the `RootLayout` or a similar layout component, so that all VEDA-UI components within the application have access to the provided configurations.

#### Example usage

Below is an example of how to configure the `VedaUIProvider` with environment variables:

```tsx
import { VedaUIProvider } from '@developmentseed/veda-ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <VedaUIProvider
      config={{
        envMapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '',
        envApiStacEndpoint: process.env.NEXT_PUBLIC_API_STAC_ENDPOINT ?? '',
        envApiRasterEndpoint: process.env.NEXT_PUBLIC_API_RASTER_ENDPOINT ?? '',
      }}
    >
      {children}
    </VedaUIProvider>
  );
}
```