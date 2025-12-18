import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/components/Modal';

describe('Modal', () => {
  // Given: モーダルが開いている状態
  // When: ESCキーを押す
  // Then: onCloseが呼ばれる
  it('should call onClose when ESC key is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    // Press ESC key
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Given: モーダルが開いている状態
  // When: 背景をクリックする
  // Then: onCloseが呼ばれる
  it('should call onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    // Click on backdrop (the outer div)
    const backdrop = screen.getByRole('dialog').parentElement;
    if (backdrop) {
      await user.click(backdrop);
    }

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Given: モーダルが開いている状態
  // When: コンテンツ部分をクリックする
  // Then: onCloseが呼ばれない
  it('should not call onClose when content is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    // Click on content
    await user.click(screen.getByText('Modal Content'));

    expect(onClose).not.toHaveBeenCalled();
  });
});

