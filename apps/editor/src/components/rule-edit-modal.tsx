import React, { useState, useEffect } from 'react';
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
import { useUpdateRule } from '../hooks/useRules';

export interface RuleEditModalProps {
  visible: boolean;
  rule: Rule | null;
  onClose: () => void;
  onSuccess?: (rule: Rule) => void;
}

interface FormValues {
  name: string;
  description: string;
}

export const RuleEditModal: React.FC<RuleEditModalProps> = ({ visible, rule, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormValues>({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const updateRuleMutation = useUpdateRule();

  // Preencher o formulário quando a regra mudar
  useEffect(() => {
    if (rule && visible) {
      setFormData({
        name: rule.name,
        description: rule.description,
      });
    }
  }, [rule, visible]);

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
    if (!rule || !validateForm()) return;

    try {
      setLoading(true);

      const updatedRule: Rule = {
        ...rule,
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
      };

      await updateRuleMutation.mutateAsync(updatedRule);

      onClose();
      onSuccess?.(updatedRule);
      toast.success('Regra atualizada com sucesso!');
    } catch (error: unknown) {
      console.error('Erro ao atualizar regra:', error);
      toast.error('Erro ao atualizar regra. Tente novamente.');
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
          <DialogTitleBase>Editar Regra</DialogTitleBase>
        </DialogHeaderBase>

        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="rule-name-edit"
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
              id="rule-name-edit"
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
              htmlFor="rule-description-edit"
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
              id="rule-description-edit"
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
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooterBase>
      </DialogContentBase>
    </DialogBase>
  );
};
