-- Model metrics table
CREATE TABLE model_metrics (
    id SERIAL PRIMARY KEY,
    model_id INTEGER NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC(10, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_model FOREIGN KEY (model_id) REFERENCES prediction_models(id) ON DELETE CASCADE,
    CONSTRAINT unique_model_metric UNIQUE (model_id, metric_name)
);

-- Ensure file_path column exists in prediction_models
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'prediction_models' 
        AND column_name = 'file_path'
    ) THEN
        ALTER TABLE prediction_models ADD COLUMN file_path VARCHAR(512);
    END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX idx_model_metrics_model_id ON model_metrics(model_id);

-- Create function to update model metrics
CREATE OR REPLACE FUNCTION update_model_metrics(
    p_model_id INTEGER,
    p_precision NUMERIC,
    p_recall NUMERIC,
    p_f1_score NUMERIC,
    p_auc_roc NUMERIC
) RETURNS VOID AS $$
BEGIN
    -- Delete existing metrics for the model
    DELETE FROM model_metrics WHERE model_id = p_model_id;
    
    -- Insert new metrics
    INSERT INTO model_metrics (model_id, metric_name, metric_value)
    VALUES
        (p_model_id, 'precision', p_precision),
        (p_model_id, 'recall', p_recall),
        (p_model_id, 'f1_score', p_f1_score),
        (p_model_id, 'auc_roc', p_auc_roc);
END;
$$ LANGUAGE plpgsql;