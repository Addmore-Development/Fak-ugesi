// Fetch awards
const awards = await API.getAwards(2025);

// Submit award application
await API.submitAward({
    name: 'John Doe',
    email: 'john@example.com',
    category: 'Digital Art',
    project_title: 'My Art Project',
    description: 'Description here...'
});

// Subscribe to newsletter
await API.subscribeNewsletter('email@example.com');

// Show notification
API.showToast('Successfully submitted!', 'success');