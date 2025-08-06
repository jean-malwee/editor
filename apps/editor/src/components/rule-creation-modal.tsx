import React, { useState } from 'react';
import {
  DialogBase,
  DialogContentBase,
  DialogHeaderBase,
  DialogTitleBase,
  DialogFooterBase,
  ButtonBase as Button,
  toast,
} from '@mlw-packages/react-components';
import { Rule } from '@repo/schemas';
import { useCreateRule } from '../hooks/useRules';
import { v4 as uuidv4 } from 'uuid';

export interface RuleCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (rule: Rule) => void;
}

interface FormValues {
  name: string;
  description: string;
}

export const RuleCreationModal: React.FC<RuleCreationModalProps> = ({ visible, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormValues>({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const createRuleMutation = useCreateRule();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormValues> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Por favor, insira o nome da regra!';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'O nome deve ter pelo menos 2 caracteres!';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'O nome deve ter no máximo 100 caracteres!';
    } else if (!/^[a-zA-Z0-9\s\-_.]+$/.test(formData.name.trim())) {
      newErrors.name = 'O nome pode conter apenas letras, números, espaços, hífens, underscores e pontos!';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'A descrição deve ter no máximo 500 caracteres!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const newRule: Rule = {
        id: uuidv4(),
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        flows: [],
      };

      await createRuleMutation.mutateAsync(newRule);

      setFormData({ name: '', description: '' });
      setErrors({});
      onClose();
      onSuccess?.(newRule);
    } catch (error: unknown) {
      console.error('Erro ao criar regra:', error);
      toast.error('Erro ao criar regra. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof FormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!visible) return null;

  return (
    <DialogBase open={visible} onOpenChange={handleCancel}>
      <DialogContentBase style={{ maxWidth: '500px' }}>
        <DialogHeaderBase>
          <DialogTitleBase>Criar Nova Regra</DialogTitleBase>
        </DialogHeaderBase>

        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="rule-name"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: errors.name ? '#ff4d4f' : undefined,
              }}
            >
              Nome da Regra *
            </label>
            <input
              id="rule-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Digite o nome da regra..."
              maxLength={100}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${errors.name ? '#ff4d4f' : '#d9d9d9'}`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            {errors.name && <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>}
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#999', marginTop: '4px' }}>
              {formData.name.length}/100
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="rule-description"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: errors.description ? '#ff4d4f' : undefined,
              }}
            >
              Descrição
            </label>
            <textarea
              id="rule-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o propósito desta regra de negócio..."
              rows={4}
              maxLength={500}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${errors.description ? '#ff4d4f' : '#d9d9d9'}`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                minHeight: '80px',
              }}
            />
            {errors.description && (
              <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>{errors.description}</div>
            )}
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#999', marginTop: '4px' }}>
              {formData.description.length}/500
            </div>
          </div>
        </div>

        <DialogFooterBase style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Criando...' : 'Criar Regra'}
          </Button>
        </DialogFooterBase>
      </DialogContentBase>
    </DialogBase>
  );
};
