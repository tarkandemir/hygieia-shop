import mongoose from 'mongoose';

export interface ISetting {
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new mongoose.Schema<ISetting>({
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {}
  }
}, {
  timestamps: true
});

const Setting = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);

export default Setting; 