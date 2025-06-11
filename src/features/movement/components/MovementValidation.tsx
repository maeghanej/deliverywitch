import { useMovementStore } from '../stores/movementStore';
import { useTransportStore } from '../../transport/stores/transportStore';

export const MovementValidation = () => {
  const { validationResult, isValidMovement } = useMovementStore();
  const { mode } = useTransportStore();

  if (!mode || !validationResult) return null;

  const errorIssues = validationResult.issues.filter(issue => issue.severity === 'ERROR');
  const warningIssues = validationResult.issues.filter(issue => issue.severity === 'WARNING');

  return (
    <div className="fixed bottom-24 left-4 max-w-sm">
      {/* Movement Status Indicator */}
      <div className={`
        mb-2 px-4 py-2 rounded-lg shadow-lg
        flex items-center space-x-2
        ${isValidMovement ? 'bg-green-500' : 'bg-red-500'}
        text-white
      `}>
        <div className={`
          w-3 h-3 rounded-full
          ${isValidMovement ? 'bg-green-200' : 'bg-red-200'}
        `} />
        <span className="font-medium">
          {isValidMovement ? 'Valid Movement' : 'Invalid Movement'}
        </span>
      </div>

      {/* Issues List */}
      {(errorIssues.length > 0 || warningIssues.length > 0) && (
        <div className="mt-2 space-y-2">
          {errorIssues.map((issue, index) => (
            <div
              key={`error-${index}`}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded shadow"
            >
              <p className="font-medium">Error</p>
              <p className="text-sm">{issue.message}</p>
            </div>
          ))}

          {warningIssues.map((issue, index) => (
            <div
              key={`warning-${index}`}
              className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded shadow"
            >
              <p className="font-medium">Warning</p>
              <p className="text-sm">{issue.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Transport Mode Mismatch */}
      {validationResult.detectedMode && validationResult.detectedMode !== mode && (
        <div className="mt-2 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded shadow">
          <p className="font-medium">Suggested Transport Mode</p>
          <p className="text-sm">
            Your movement pattern suggests you are {validationResult.detectedMode.toLowerCase()}.
            Consider switching modes for better tracking.
          </p>
        </div>
      )}
    </div>
  );
}; 