# Styling and theming

This guide explains how to set up and customize styles for the application which uses the U.S. Web Design System (USWDS) as a foundation. The application can integrate with `veda-ui` for core feature components styled with USWDS or use `react-uswds` for standalone UI elements like buttons, inputs, modals, etc.

The application is designed to support the USWDS styling framework for consistent and accessible design.

## Setup requirements

To use USWDS-based styles:

1. **Install Required Dependencies**

    Make sure `@uswds/uswds` and `sass` are installed:

    ```bash
    npm install @uswds/uswds@^3.8.1 sass
    # or
    yarn add @uswds/uswds@^3.8.1 sass
    ```

2. **Configure SASS**

   Update your `sassOptions` in the `next.config.js` file to include the necessary USWDS paths. This allows SASS to resolve and process the USWDS styles correctly:

   ```js
   module.exports = {
     sassOptions: {
       includePaths: [
         'node_modules/@uswds/uswds',
         'node_modules/@uswds/uswds/dist',
         'node_modules/@uswds/uswds/packages',
       ],
     },
   };
   ```

3. **Import and customize styles**

    Create a custom theme configuration file (e.g., `app/styles/_uswds-theme.scss`) to define your application's tokens such as colors, typography, and asset paths. This file allows you to adapt USWDS to your application's branding and design needs.

    Example `_uswds-theme.scss`:

    ```scss
    @use 'uswds-core' with (
        $theme-image-path: '/img',
        $theme-font-path: '/fonts',
        $theme-show-notifications: false,
        $utilities-use-important: true,
        $theme-font-weight-semibold: '600',
        $theme-type-scale-md: 8,
        $theme-color-primary: 'blue-50',
        $theme-color-secondary: 'gold-30'
    );
    ```

    Import your theme and other USWDS styles into a main SCSS file (e.g., `app/styles/index.scss`) to be used in your application.

    ```scss
    @forward 'uswds-theme';
    @forward 'uswds';

    @use 'uswds-core' as *;
    ```

4. **Include styles in the application**

    Import the SCSS file into the root of your application to apply the styles globally:

    ```tsx
    import './styles/index.scss';
    import '@developmentseed/veda-ui/lib/main.css';
    ```







