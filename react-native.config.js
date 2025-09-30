module.exports = {
  dependencies: {
    'react-native-reanimated': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-reanimated/android/',
          packageImportPath: 'import io.swmansion.reanimated.ReanimatedPackage;',
        },
      },
    },
    'react-native-worklets': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-worklets/android/',
          packageImportPath: 'import com.worklets.WorkletsPackage;',
        },
      },
    },
  },
};
