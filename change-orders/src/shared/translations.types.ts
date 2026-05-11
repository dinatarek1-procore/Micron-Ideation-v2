export const translations = {
  tool: {
    document: {
      title: 'Prototype — %{companyName}',
    },
    actions: {
      cancel: 'Cancel',
      close: 'Close',
      configureSettings: 'Configure settings',
      create: 'Create item',
      edit: 'Edit',
      save: 'Save',
      submit: 'Submit',
    },
    tabs: {
      overview: 'Overview',
      emails: 'Emails',
      relatedItems: 'Related items',
      documents: 'Documents',
      history: 'Change history',
    },
    views: {
      list: {
        title: 'Items',
        emptyTitle: 'No items yet',
        emptyDescription: 'Create an item to see it in the table.',
        columns: {
          title: 'Title',
          status: 'Status',
          priority: 'Priority',
          assignee: 'Assignee',
          category: 'Category',
          dueDate: 'Due date',
        },
      },
      detail: {
        title: 'Item details',
        formTitle: 'Item',
      },
      itemExtensions: {
        bannerTitle: 'Prototype tab',
        hint: 'Swap this placeholder for the %{integrationId} package or remote MFE. Active Toolinator view: %{viewName}.',
      },
      itemEmails: {
        title: 'Emails',
        placeholderBody:
          'Engagement surface mirrors Planroom: communication banner, then threaded-style list from the same REST shape.',
        list: {
          from: 'From %{from}',
          to: 'To %{to}',
          nameWithCompany: '%{name} (%{company})',
        },
        columns: {
          subject: 'Subject',
          recipient: 'Recipient',
          sentAt: 'Sent',
          status: 'Status',
        },
      },
      itemRelatedItems: {
        title: 'Related items',
        placeholderBody:
          'Item tab uses `@procore/related-items` RelatedItems (v2 related_items APIs), not JSON Tabulator + Mirage v1 table.',
        relatedItemsPackageHint:
          'Related items UI from `@procore/related-items`. Mirage stubs v2 endpoints; use staging or wire real services for full behavior.',
        columns: {
          relatedTool: 'Tool',
          relatedTitle: 'Title',
          linkedAt: 'Linked',
          linkedBy: 'Linked by',
        },
      },
      itemDocuments: {
        title: 'Documents',
        placeholderBody:
          'Item tab uses `@procore/labs-file-select` ConnectedFileSelect (local + Documents), not Mirage JSON Tabulator.',
        connectedFileSelectHint:
          'Connected file select: local uploads and project Documents (configure document_service / staging per labs-file-select README).',
        columns: {
          filename: 'File',
          version: 'Version',
          uploadedAt: 'Uploaded',
          uploadedBy: 'Uploaded by',
          sizeBytes: 'Size',
        },
      },
      itemHistory: {
        title: 'Change history',
        displayToolName: 'Prototype item',
      },
      edit: {
        title: 'Edit item',
      },
      create: {
        title: 'Create item',
      },
      permissions: {
        title: 'Permissions',
        toolName: 'Prototype tool',
      },
    },
  },
  relatedItems: {
    tasks: {
      assignees: 'Assignees',
      dueDate: 'Due date',
      category: 'Category',
    },
  },
  core: {
    banner: {
      dismissAlert: 'Dismiss Alert',
      expand: 'Expand',
      collapse: 'Collapse',
    },
    breadcrumbs: {
      label: 'Breadcrumb',
    },
    calendar: {
      navigationLabel: 'Go to %{monthYear}',
    },
    connected: {
      fileSelect: {
        documents: 'Documents',
        drawings: 'Drawings',
        forms: 'Forms',
        photos: 'Photos',
        selectAlbum: 'Select album',
        selectAnAlbum: 'Select an Album',
        selectArea: 'Select area',
        selectAnArea: 'Select an Area',
        selectDiscipline: 'Select discipline',
        selectADiscipline: 'Select a Discipline',
        selectSet: 'Select set',
        selectASet: 'Select a Set',
        selectTemplate: 'Select template',
        selectATemplate: 'Select a Template',
      },
      emails: {
        emailSendErrorTitle: "Sorry, we couldn't send this message.",
        emailBodyRequiredError:
          'Please fix the errors below, and try creating again.',
        emailContentValidationError: 'Enter message to send.',
        emailContentDisclaimer:
          'Note: The general information about “%{title}” will be included in the body of this email.',
        recipientSelectPlaceholder: 'Type to search people',
        emailRecipientRequiredError: 'Enter recipient to send.',
        emailSubjectRequiredError: 'Enter Subject to send.',
        goToAllEmails: 'All Emails',
        sendEmail: 'Send',
        replyAll: 'Reply All',
        downloadAll: 'Download All',
        showAll: 'Show all',
        showLess: 'Show less',
        composeEmailPageTitle: 'Compose New Email',
        emailSentMessage: 'The email was successfully sent.',
        from: 'From',
        to: 'To',
        cc: 'Cc',
        bcc: 'Bcc',
        downloadPdfLong: 'Download PDF',
        downloadPdfShort: 'PDF',
        privateEmailDisclaimer:
          'Private emails are only shown to recipients and the sender of the email.',
        privateLabel: 'Private',
        settingsLink: 'Settings',
        composeNewEmail: 'Compose Email',
        startNewCommunication:
          'To initiate a new communication thread associated with this item, send an email to',
        emptyStateTitle: 'Send an Email to Get Started',
        emptyStateDescription:
          'When you and your team send emails about this item, you can reference them here.',
        reply: 'Reply',
        cancel: 'Cancel',
        subject: 'Subject',
        subjectPlaceholder: 'Enter subject here',
      },
      distributionSelect: {
        noCompany: 'No company',
        peopleCount: '%{count} people',
        distributionGroups: 'Distribution Groups',
        people: 'People',
      },
      relatedItems: {
        cancel: 'Cancel',
        close: 'Close',
        date: 'Date',
        itemType: 'Item Type',
        itemTypeGroupLabel: {
          dailyLog: 'Daily Log',
          prostoreFile: 'Attach Files',
        },
        itemName: 'Item Name',
        loading: 'Loading',
        notes: 'Notes',
        notesPlaceholder: 'Optional explanation of why this item is related',
        newItem: 'Link Related Item',
        noRelatedItems: {
          title: 'Link Related Items to Get Started',
          description:
            'Linking items to this %{itemName} makes it easier for you and your team to find relevant information throughout Procore.',
        },
        noItems: {
          title: 'There Are No Items to Display',
          description:
            'Create items in your project to add them as related items here.',
        },
        noResultsSearchQuery: {
          title: 'No Items Match Your Search',
          description:
            'Check your spelling and filter options, or search for a different keyword.',
        },
        noResultsServerError: {
          title: 'Something Went Wrong',
          description: 'Please check your internet connection and try again.',
          action: 'Try Again',
        },
        panelTitle: 'Link Related Item',
        search: 'Search',
        searchItemType: 'Search item type',
        submit: 'Link',
        toast: {
          itemAdded: 'The related item was successfully linked.',
          itemAdditionFailed:
            'Sorry, the item couldn’t be attached. Please try again.',
          itemRemoved: 'The related item was successfully removed.',
          requestError: 'Sorry, something went wrong. Please try again.',
        },
      },
    },
    dateTimeFormat: {
      dateAtTime: '%{date} at %{time}',
      timeOnDate: '%{time} on %{date}',
    },
    table: {
      a11y: {
        expand: 'Expand',
        collapse: 'Collapse',
      },
      checkboxLabel: 'Select row',
      sortableColumn: 'Sortable column',
    },
    dataTable: {
      emptyState: {
        noFilteredResults: {
          description:
            'Check your spelling and filter options, or search for a different keyword.',
          title: 'No Items Match Your Search',
        },
      },
      exporting: 'Exporting...',
      filters: {
        filters: 'Filters',
        moreFilters: 'More Filters',
        clearAllFilters: 'Clear All Filters',
      },
      grandTotals: 'Grand Totals',
      search: 'Search',
      subtotals: 'Subtotals',
      tableSettings: {
        configureColumns: 'Configure Columns',
        resetToDefault: 'Reset To Default',
        rowHeight: 'Row Height',
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
        tableSettings: 'Table Settings',
      },
    },
    dateInput: {
      clear: 'Delete field',
      ariaLabel: 'Current value is %{value}',
      segment: {
        ariaLabel: {
          withValue: {
            month: 'Month, %{value}',
            day: 'Day, %{value}',
            year: 'Year, %{value}',
          },
          withoutValue: {
            month: 'Set a month',
            day: 'Set a day',
            year: 'Set a year',
          },
        },
        ariaValueText: {
          empty: 'Empty',
        },
      },
      clearButton: {
        ariaLabel: 'Remove the date',
      },
    },
    dropdown: {
      search: 'Search',
      moreOptions: 'More Options',
      loading: 'Loading',
    },
    dropzone: {
      uploadFiles: {
        one: 'Upload File',
        other: 'Upload Files',
      },
      dragAndDrop: 'or Drag & Drop',
      incorrectFileTypeMessage: {
        one: 'Sorry - that file type is not allowed.',
        other: 'Sorry, some of those file types are not allowed.',
      },
      incorrectFileNumber:
        'Sorry, we can’t upload this number of files at once.',
      invalidAmountAttachments: {
        one: 'Sorry, only %{count} file can be attached.',
        other: 'Sorry, only %{count} files can be attached.',
      },
      hideDetails: 'Hide Details',
      showDetails: 'Show Details',
      errorTitle: "We Couldn't Upload Some of Your Files",
      oneFileAtATimeError: 'Sorry, you can only attach one file at a time.',
      multipleErrorsMessage:
        'Sorry, errors prevented some files from uploading. Please try uploading the files again.',
      maxFileSizeErrorGroup:
        'One or more of your files exceeds the max file size of %{sizeInMegabytes}mb. Please try uploading a smaller file.',
      minFileSizeErrorGroup:
        'One or more of your files does not meet the min file size of %{sizeInMegabytes}mb. Please try uploading a bigger file.',
      zeroFileSizeErrorGroup:
        'Failed to upload files. Empty files are not supported.',
      maxFileNumberErrorGroup:
        'Only (%{count}) files can be uploaded at one time. Please remove some files and try again.',
      wrongFileTypeErrorGroup:
        'Some of the file types you tried to upload are not supported in Procore. Please try uploading a different file format.',
      standaloneMaxFileNumberError:
        'Only (%{maxFiles}) files can be uploaded at one time. Please remove some files and try again.',
      standaloneUnsupportedFileTypeError:
        'Some of the file types you tried to upload are not supported in Procore. Please try uploading a different file format.',
      standaloneMinFileSizeError:
        'One or more of your files does not meet the min file size of %{sizeInMegabytes}mb. Please try uploading a bigger file.',
      standaloneMaxFileSizeError:
        'One or more of your files exceeds the max file size of %{sizeInMegabytes}mb. Please try uploading a smaller file.',
      standaloneZeroFileSizeError:
        'One or more of your files is an empty file (0 bytes) and cannot be uploaded. Please try uploading a bigger file.',
      uploadTotalProgress: {
        withFailed:
          'Total Progress: %{totalProgress}%. Uploaded %{uploaded} of %{total}. Failed %{failed}.',
        withoutFailed:
          'Total Progress: %{totalProgress}%. Uploaded %{uploaded} of %{total}.',
      },
    },
    modal: {
      a11y: {
        close: 'Close',
      },
      cancel: 'Cancel',
    },
    multiSelect: {
      clearAll: 'Delete field',
      selectValues: 'Select Values',
      noResults: 'No results',
      selectedToken: '%{tokenLabel}, selected',
      selectedItems: 'Selected items',
      noneSelected: 'None selected',
    },
    tearsheet: {
      a11y: {
        close: 'Close',
      },
    },
    fileAttacher: {
      attachFiles: {
        one: 'Attach File',
        other: 'Attach Files',
      },
    },
    fileToken: {
      uploading: 'Uploading',
    },
    tree: {
      expand: 'Expand',
      collapse: 'Collapse',
      selectionLimit: {
        one: 'Only %{count} file can be attached',
        other: 'Only %{count} files can be attached',
      },
      unsupportedFileType: {
        specific: '%{fileType} file types are unsupported',
        unspecific: 'These file types are unsupported',
      },
    },
    fileExplorer: {
      filesSelectedWithLimit: '%{count} of %{maxFileNumber} files selected',
      ungroupedThumbnailGridGroup: 'Ungrouped',
      filesSelected: {
        one: '%{count} file selected',
        other: '%{count} files selected',
      },
      cancelAction: 'Cancel',
      attachAction: 'Attach',
      maxNumberOfFilesSelected: 'Maximum number of files selected',
      modalTitle: 'Attach Files',
      filesPendingUpload: 'One or more files have not finished uploading.',
      noSelectedItems: 'Please select a file.',
      emptySearchResults: 'No results found',
      noItems: 'No items',
      searchPlaceholder: 'Search',
      uploadFailed: 'Upload Failed',
      supportedFileTypes: 'Supported file types',
    },
    form: {
      closeWithConfirm: {
        confirmMessage:
          'If you leave before saving, your changes will be lost.',
      },
      checkbox: {
        no: 'No',
        yes: 'Yes',
        checked: 'Checked',
        unchecked: 'Unchecked',
      },
      errorBanner: {
        couldNotCreateItem: "Sorry, we couldn't create this %{item}.",
        couldNotUpdateItem: "Sorry, we couldn't update this %{item}.",
        fixErrorsToCreate:
          'Please fix the errors below, and try creating again.',
        fixErrorsToUpdate:
          'Please fix the errors below, and try updating again.',
      },
      field: {
        tooltipHelp: 'More Information',
      },
    },
    menu: {
      search: 'Search',
    },
    pagination: {
      interval: 'of',
      notation: '%{start}-%{end} of %{totalItems}',
      page: 'Page:',
      nextPage: 'Next page',
      prevPage: 'Previous page',
    },
    search: {
      clear: 'Clear text',
      goSearch: 'Go to search results',
      label: 'Search',
    },
    select: {
      clear: 'Delete field',
      search: 'Search',
      selectAll: 'Select All',
      noResult: 'No results',
    },
    splitViewCard: {
      a11y: {
        close: 'Close',
      },
    },
    tabs: {
      more: 'More',
    },
    thumbnail: {
      checked: 'Checked',
      unavailable: 'Content is unavailable',
      select: 'Select item',
    },
    thumbnailList: {
      removeUpload: 'Remove upload',
      uploading: 'Uploading',
    },
    toast: {
      a11y: {
        dismiss: 'Dismiss',
      },
    },
    fileList: {
      downloadAll: 'Download All',
      download: 'Download',
      noPreview: 'No Preview Available',
    },
    tieredSelect: {
      emptyMessage: 'No locations.',
      goToTier: 'Go to sub menu',
      placeholder: 'Select an item',
      quickCreateActionLabel: 'Create New Location',
      quickCreateCancelLabel: 'Cancel',
      quickCreateCreateLabel: 'Create',
      quickCreatePlaceholder: 'Add location',
      searchEmptyMessage: 'No results.',
      searchPlaceholder: 'Search existing locations',
      spinnerLabel: 'Loading',
    },
    tieredDropdown: {
      emptyMessage: 'No Items.',
      searchEmptyMessage: 'No results.',
      searchPlaceholder: 'Search',
      spinnerLabel: 'Loading',
    },
    spinner: {
      loading: 'Loading',
    },
    token: {
      remove: 'Remove',
    },
    toolHeader: {
      settingsAction: 'Configure Settings',
    },
    fileSelect: {
      localFilesSource: 'My Computer',
      uploadFailed: 'Upload Failed',
      maxNumberOfFilesSelected: 'Maximum number of files selected',
    },
    required: {
      requiredFields: 'Required fields',
    },
    avatarStack: {
      viewAll: 'View All',
      close: 'Close',
    },
    panel: {
      close: 'Close',
      goBack: 'Go back',
    },
    menuImperative: {
      options: {
        ariaLabel: 'Menu options',
      },
    },
  },
  /** Keys used by `@procore/json-toolinator` error UI (`i18n.t('views.generic.errors.*')`). */
  views: {
    generic: {
      errors: {
        server_error: 'Server error',
      },
    },
  },
} as const;

export type Translations = typeof translations;
