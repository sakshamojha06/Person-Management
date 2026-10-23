import { NotificationService } from './notification';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  it('should show the notification and dismiss it after four seconds', () => {
    vi.useFakeTimers();

    service.show('Person added successfully.', 'success');

    expect(service.message()).toBe('Person added successfully.');
    expect(service.type()).toBe('success');

    vi.advanceTimersByTime(4000);

    expect(service.message()).toBe('');
    vi.useRealTimers();
  });

  it('should dismiss a notification immediately', () => {
    service.show('Person updated successfully.', 'success');

    service.dismiss();

    expect(service.message()).toBe('');
  });
});
