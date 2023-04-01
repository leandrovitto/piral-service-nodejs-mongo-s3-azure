type Messages = {
  errors: {
    pilet: {
      saving: string;
      package_json: string;
      not_found: string;
    };
    piletVersion: {
      get: string;
      update: string;
      delete: string;
    };
    auth: {
      unauthorized: string;
    };
  };
  labels: {
    pilet: {
      saved: string;
    };
    piletVersion: {
      saved: string;
      unique: string;
    };
  };
};

const messages: Messages = {
  errors: {
    pilet: {
      saving: 'Error pilet saving!',
      package_json: 'Packages.json miss!',
      not_found: 'Pilet not found, creation in progress...',
    },
    piletVersion: {
      get: 'Error get pilets version!',
      update: 'Error update pilet version enabled!',
      delete: 'Error delete pilet version!',
    },
    auth: {
      unauthorized: 'Invalid API key supplied.',
    },
  },
  labels: {
    pilet: {
      saved: 'Pilet saved in DB',
    },
    piletVersion: {
      saved: 'Pilet Version saved in DB',
      unique:
        'There is a unique constraint violation, a new user cannot be created with this name',
    },
  },
};

export { messages, Messages };
